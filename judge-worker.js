let pyodidePromise=null;
const PYODIDE_SOURCES=[
  'https://cdn.jsdelivr.net/npm/pyodide@314.0.6/',
  'https://cdn.jsdelivr.net/pyodide/v314.0.6/full/',
  'https://unpkg.com/pyodide@314.0.6/'
];

async function loadFromAnySource(){
  let lastError=null;
  for(const base of PYODIDE_SOURCES){
    try{
      if(typeof loadPyodide!=='function') importScripts(base+'pyodide.js');
      return await loadPyodide({indexURL:base});
    }catch(err){
      lastError=err;
    }
  }
  throw new Error(`Could not load the Python runtime from any CDN. Last error: ${String(lastError?.message||lastError)}`);
}

async function getPyodide(){
  if(!pyodidePromise) pyodidePromise=loadFromAnySource();
  return pyodidePromise;
}

self.onmessage=async e=>{
  if(e.data?.type!=='run')return;
  try{
    const pyodide=await getPyodide();
    pyodide.globals.set('USER_CODE',e.data.code);
    pyodide.globals.set('CASES_JSON',JSON.stringify(e.data.cases));
    const raw=await pyodide.runPythonAsync(`
import json, traceback
ns={}
results=[]
try:
    exec(USER_CODE, ns)
    fn=ns.get('solve')
    if not callable(fn):
        raise TypeError('Your code must define a callable solve(data) function.')
    cases=json.loads(CASES_JSON)
    for case in cases:
        try:
            actual=fn(case['input'])
            expected=case['output']
            passed=(actual==expected)
            results.append({'label':case['label'],'passed':passed,'actual':actual,'expected':expected,'error':''})
        except Exception:
            results.append({'label':case['label'],'passed':False,'actual':None,'expected':case['output'],'error':traceback.format_exc(limit=4)})
    json.dumps({'results':results}, default=str)
except Exception:
    json.dumps({'fatal':traceback.format_exc(limit=6)})
`);
    const parsed=JSON.parse(raw);
    if(parsed.fatal){self.postMessage({error:parsed.fatal,runtime:'Python / Pyodide'});return}
    self.postMessage({results:parsed.results,runtime:'Python / Pyodide'});
  }catch(err){self.postMessage({error:String(err?.stack||err),runtime:'Judge unavailable'});}
};
