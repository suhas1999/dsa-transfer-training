let pyodidePromise=null;
const PYODIDE_URL='https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';

async function getPyodide(){
  if(!pyodidePromise){
    importScripts(PYODIDE_URL+'pyodide.js');
    pyodidePromise=loadPyodide({indexURL:PYODIDE_URL});
  }
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
    _judge_payload={'results':results}
except Exception:
    _judge_payload={'fatal':traceback.format_exc(limit=6)}
_JUDGE_RESULT=json.dumps(_judge_payload, default=str)
_JUDGE_RESULT
`);
    if(typeof raw!=='string') throw new Error(`Judge returned an unexpected payload type: ${typeof raw}`);
    const parsed=JSON.parse(raw);
    if(parsed.fatal){self.postMessage({error:parsed.fatal,runtime:'Python / Pyodide 0.28.3'});return}
    self.postMessage({results:parsed.results,runtime:'Python / Pyodide 0.28.3'});
  }catch(err){self.postMessage({error:String(err?.stack||err),runtime:'Judge unavailable'});}
};
