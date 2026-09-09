'use client';
import {useState} from 'react';
import {site} from '@/lib/site';
export function CopyAddress(){const [status,setStatus]=useState('');async function copy(){try{await navigator.clipboard.writeText(site.address);setStatus('地址已复制');}catch{setStatus('请长按或选中上方地址复制');}}return <div><button className="plain-button" onClick={copy}>复制到所地址</button><p className="note" role="status">{status}</p></div>}
export function PrintGuide(){return <button className="plain-button" onClick={()=>window.print()}>打印这份准备清单 ↗</button>}

export function CopyWechat(){const [status,setStatus]=useState('');async function copy(){try{await navigator.clipboard.writeText(site.wechat);setStatus('微信号已复制，请在微信中搜索添加');}catch{setStatus('请选中微信号复制：'+site.wechat);}}return <div><button className="plain-button" onClick={copy}>复制微信号 ↗</button><p className="copy-status" role="status">{status}</p></div>}
