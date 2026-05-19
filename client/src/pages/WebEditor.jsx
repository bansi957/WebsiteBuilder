import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { Code2, MessageSquare, Monitor, Rocket, Send } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { AnimatePresence,motion } from 'motion/react'
import Editor from '@monaco-editor/react';
import { X } from 'lucide-react'
function WebEditor() {
    const {websiteId}=useParams()
    const [websiteData,setWebsiteData]=useState(null)
    const [error,setError]=useState(null)
    const iframeRef=useRef(null)
    const [code,setCode]=useState("")
    const [messages,setMessages]=useState([])
    const [prompt,setPrompt]=useState("")
    const [updateLoading,setUpdateLoading]=useState(false)
    const [showPreview,setShowPreview]=useState(false)
    const thinkingSteps=[
        "Understanding your request...",
        "Planning layout changes...",
        "Improving responsiveness...",
        "Applying animations...",
        "Finalizing update..."
    ]
    const [showCode,setShowCode]=useState(false)
    const [thinkingIndex,setThinkingIndex]=useState(0)
    const [showMobileChat,setShowMobileChat]=useState(false)
    useEffect(()=>{
       const fetchData=async ()=>{
           try {
            const result=await axios.get(`${serverUrl}/api/website/get-by-id/${websiteId}`,{
                withCredentials:true
            })
            console.log(result.data)
            setWebsiteData(result.data.website)
            setCode(result.data.website.latestCode)
            setMessages(result.data.website.conversation)
           } catch (error) {
            console.log(error)
            setError(error.response.data)
           }
        }
        fetchData()
    },[websiteId])
    
    useEffect(()=>{
        if(!iframeRef.current || !code){
            return }
        const blob=new Blob([code],{type:"text/html"})
        const url=URL.createObjectURL(blob)
        iframeRef.current.src=url

        return()=>URL.revokeObjectURL(url)
        
    },[code])
    useEffect(()=>{
        if(!updateLoading){
            return
        }
        const i=setInterval(()=>{
            setThinkingIndex((i)=>(i+1)%thinkingSteps.length)   
        },1200)
        return ()=>clearInterval(i)
    },[updateLoading])

    const handleUpdate=async()=>{
        const text=prompt.trim()
        if(!text){
            return
        }
        setPrompt("")
        setMessages((m)=>[...m,{role:"user",content:prompt}])
        setUpdateLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/website/update/${websiteId}`,{prompt:text},{withCredentials:true})
            setMessages((m)=>[...m,{role:"ai",content:result.data.message}])
            setCode(result.data.code)
            setUpdateLoading(false)
        } catch (error) {
            console.log(error)
            setUpdateLoading(false)
        }
    }

    if(error){
        return (
            <div className='min-h-screen flex items-center justify-center bg-[#040404] text-white'>
                <h1 className='text-2xl font-semibold'>{error.message}</h1>
            </div>
        )
    }
    if(!websiteData){
        return (
            <div className='min-h-screen flex items-center justify-center bg-[#040404] text-white'>
                <h1 className='text-2xl font-semibold'>Loading...</h1>
            </div>
        )
    }
  return (
    <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
      <aside className='hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80'>
        <Header/>
          <div className='flex-1 px-4 py-4 flex flex-col space-y-4 overflow-y-auto'>
            {messages.map((item,index)=>(
                <div key={index} className={`max-w-[85%] ${item.role==="user" ? "ml-auto":"mr-auto"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${item.role==="user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"}`}>
                         {item.content}
                    </div>
                   
                </div>
            ))}

            {updateLoading && (
                <div className='max-w-[85%] mr-auto'>
                    <div className='px-4 py-2.5 rounded-2xl text-xs  bg-white/5 border border-white/10 text-zinc-400 italic'>
                         {thinkingSteps[thinkingIndex]}
                    </div> </div>)}
          
        </div>
          <div className='p-3 border-t border-white/10'> 
                <div className='flex gap-2'>
                    <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} className='flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20' placeholder='Ask AI for changes...' rows="1" />
                    <button cursor-pointer onClick={handleUpdate} disabled={updateLoading} className='px-4 py-3 rounded-2xl  text-sm bg-white text-black '>{updateLoading? <Loader2 size={14} />: <Send size={14}/>}</button>
                </div>
                    
            </div>
      </aside>
      <div className='flex-1 flex flex-col'>
        <div className='h-14 px-4 flex  justify-between items-center border-b border-white/10 bg-black/80'>  
        <span className='text-xs text-zinc-400'>Live Preview</span>
       <div className='flex items-center gap-2'>
         <button className='flex items-center gap-2 px-4 py-1.5 rounded-lg  bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition'><Rocket size={14} />Deploy</button>
         <button className="p-2 lg:hidden" onClick={()=>setShowMobileChat(!showMobileChat)}><MessageSquare size={18}/></button>
        <button className="p-2" onClick={()=>{setShowCode(!showCode)}}><Code2 size={18} /> </button>
        <button className="p-2" onClick={()=>setShowPreview(!showPreview)}><Monitor size={18}/></button>
       </div>
         </div>

         <iframe className='flex-1 w-full bg-white' ref={iframeRef} />

      </div>
    <AnimatePresence>
        {showMobileChat && (
            <motion.div 
            initial={{y:"100%"}}
            animate={{y:0}}
            exit={{y:"100%"}}
            className='fixed inset-0  bg-black z-9999 flex flex-col lg:hidden'
            >
                  
        <Header/>
          <div className='flex-1 px-4 py-4 flex flex-col space-y-4 overflow-y-auto'>
            {messages.map((item,index)=>(
                <div key={index} className={`max-w-[85%] ${item.role==="user" ? "ml-auto":"mr-auto"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${item.role==="user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"}`}>
                         {item.content}
                    </div>
                   
                </div>
            ))}

            {updateLoading && (
                <div className='max-w-[85%] mr-auto'>
                    <div className='px-4 py-2.5 rounded-2xl text-xs  bg-white/5 border border-white/10 text-zinc-400 italic'>
                         {thinkingSteps[thinkingIndex]}
                    </div> </div>)}
          
        </div>
          <div className='p-3 border-t border-white/10'> 
                <div className='flex gap-2'>
                    <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} className='flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20' placeholder='Ask AI for changes...' rows="1" />
                    <button cursor-pointer onClick={handleUpdate} disabled={updateLoading} className='px-4 py-3 rounded-2xl  text-sm bg-white text-black '>{updateLoading? <Loader2 size={14} />: <Send size={14}/>}</button>
                </div>
                    
            </div>
   
                
            </motion.div>)}
    </AnimatePresence>
      <AnimatePresence>
        {showCode && (
            <motion.div 
            initial={{x:"100%"}}
            animate={{x:0}}
            exit={{x:"100%"}}
            className='fixed inset-y-0 right-0 w-full bg-[#1e1e1e] z-9999 lg:w-[45%] flex flex-col'
            >
                <div className='h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]'>
                    <span className='text-sm font-medium'>
                        index.html
                    </span>
                    <button onClick={()=>setShowCode(false)} className='p-2 rounded-lg hover:bg-white/10 transition'><X size={18}/></button>
                </div>
                <Editor theme='vs-dark' value={code} language='html' onChange={(v)=>setCode(v)}/>
            </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showPreview && (
            <motion.div 
            
            className='fixed inset-0  bg-black z-9999 '
            >
                    <button onClick={()=>setShowPreview(false)} className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg '><X size={18}/></button>
                <iframe className='w-full h-full bg-white' srcDoc={code} />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

function Header(){
    return (
        <div className='h-14 px-4 flex items-center justify-between border-b border-white/10'>
            <span className='truncate font-semibold'>{websiteData?.title} </span>
            <button onClick={()=>setShowMobileChat(false)} className='p-2 lg:hidden'><X size={18}/></button>
        </div>
    )
}




}


export default WebEditor
