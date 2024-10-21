const cache = new WeakMap()

interface effect{
  exec:()=>void
  deps:Set<Set<effect>>
}

const effectStack:effect[] = []

function cleanup(effect:effect){
  for(const sub of [...effect.deps]){
    if(sub.has(effect))sub.delete(effect)
  }
  effect.deps.clear()
}

function subscribe(effect:effect,subs:Set<effect>){
  subs.add(effect)
  effect.deps.add(subs)
}

function isObject(target:unknown){
  const type = Object.prototype.toString.call(target).slice(8,-1).toLowerCase()
  if(type === 'object')return true
  return false
}

export function reactive<T extends object>(target:T):T{
  if(!isObject(target))return target

  const exist = cache.get(target)
  if(exist){
    //避免重复代理
    return exist
  }

  if(target['__v_reactivity']){
    // 避免嵌套代理
    return target
  }

  const subs:Set<effect> = new Set()

  const object = new Proxy(target,{
    get:(target,key,receiver)=>{
      if(key === '__v_reactivity'){
        return true
      }
      // TODO 收集依赖  让effect订阅
      const effect = effectStack.slice(-1)[0]
      if(effect){
        subscribe(effect,subs)
      }
      const result = Reflect.get(target,key,receiver)
      if(isObject(result)){
        return reactive(result as object)
      }
      return result
    },
    set:(target,key,value,receiver)=>{
      // TODO 派发更新 通知effect更新
      const result = Reflect.set(target,key,value,receiver)
      for(const { exec } of [...subs]){
        exec()
      }
      return result
    }
  })
  return object
}


export function effect(callcack:Function){  
  function exec(){
    // 清除依赖 并重新订阅
    cleanup(effect)
    effectStack.push(effect)  
  
    try{
      callcack()
    }finally{
      effectStack.pop()
    }
  }
  const effect:effect = {
    exec,
    deps:new Set()    
  }
  exec()
}


