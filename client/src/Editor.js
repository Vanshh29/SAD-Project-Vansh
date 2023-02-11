// 44. we can get rid of useEffect & useRef as we are not using them anymore
// import React, { useEffect, useRef, useCallback} from 'react'
//import { useCallback } from 'react';//
import { useCallback, useEffect, useState } from 'react';
// 75. importing socket.io-client
import {io} from 'socket.io-client'

import Quill from 'quill'
// quill default CSS
import "quill/dist/quill.snow.css"
// 124. getting document id from react router via useParams
import { useParams } from 'react-router-dom';


// 171. defining that variable here
const SAVE_INTERVAL_MS = 2000

// 45. adding more features for our editor toolbar from quill
// 46. creating an array which have some more arrays inside of it with their own section.
// 47. the blank brackets will auto populated as we are already using a quill theme.
// 48. it's all from quill documentations and we can add more from that source.
const toolbarFeatures = [
 
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
 ]
 
export default function Editor() {
  
    // 125. this params contains our id object, we are just renaming it to documentId. This is is same as it named in the App.js file
    const {id: documentId} = useParams()
    // console.log(documentId)
    // 83. to make sure we can access our socket from everywhere, putting it into useState
     const [socket, setSocket] = useState()
    // 85. doing the same thing for our quill instance
     const [quill, setQuill] = useState()

     
    // 78. make sure we do this connection in s useEffect as we have to do this only once.
    // 89. this useEffect is creating a socket for us and disconnecting it when we no longer needed.
   useEffect(()=>{
    // 79. in this useEffect we wanna call io with the URL we are connecting to.
    // 80. now this will return us a socket
    //  const socket = io("http://localhost:3001")
    // 86. changing the variable so it doesn't overlap
         const s = io("http://localhost:3001")
         // 87. setting socket
         setSocket(s)

     // 81. also making sure to clean this up
     return() =>{
        // 82. so when we are done, we are disconnecting with the server.
    //    socket.disconnect();
    // 88. also updating the variable name here
            s.disconnect();
     }
    },[])




    // 122. telling the server what document we are actually a part of
    useEffect(() => {
        if(socket == null && quill == null) return

        // 128. making sure we listen to that event first
            // 129. we can say socket.on but we only required to listen to once so we use socket.once
        socket.once('load-document', document => {
            // 130. loading our text editor with this content inside of it
            quill.setContents(document)
            // 133. and now enabling the editor after loading the doc
                // 134. but right now we are not getting anything from the server so we are locked to only "Loading..." and cant type anything in the editor.
                // 135. so have to create the load doc in Server.js
            quill.enable()
        })
        // 126. this is going to send the document id to the server so we can actually attach ourself to the room for that document.
            // 127. and if the doc saved, it will send us that doc back to us
        socket.emit('get-document', documentId)
    },[socket, quill, documentId])
    // 123. this useEffect is going to depend upon socket, quill and documentId.
        // so every time one of those changes, this code will run.

    // 167. another useEffect to do the savings of docs from server
    useEffect(() => {
        if(quill == null || socket == null) return

        // 168. setting up a timer to save the doc frequently
        const interval = setInterval(() => {
            // 172. saving the doc taking from quill.getContent
            socket.emit('save-document', quill.getContents()) 

        // 169. passing how many milliseconds we have to wait
            // 170. creating a variable for time
        }, SAVE_INTERVAL_MS)
        // 173. in return clearing out the interval
        return() => {
            clearInterval(interval)
        }
    }, [socket, quill])
        
    
    // Receiving changes from server back to client

    // 110. creating another but similar useEffect to listen to changes from server via quill
    // 111. and our handler here is for receiving the event
    // 113. so now this is only updating the document changes that are passed by other client.
    useEffect(() => {
        if (socket == null || quill == null)  return
        const handler = (delta) =>{
            quill.updateContents(delta)
        }
        // 112. so instead of doing this with quill, we will do with socket.
        socket.on('receive-changes', handler)
        return() => {
            socket.off('receive-changes', handler)
        }
    }, [socket, quill])
    
    


    // Sending quill changes to server:

    // 91. now we have access to socket and quill variable
     // 92. creating a useEffect, this will detect any changes whenever quill changes
     useEffect(() => {
         // 105. when we first run this code, quill and socket would be undefined, so making sure
         if (socket == null || quill  == null) return

         // 101. so we have to separate the function and create a variable of it.
         const handler = (delta, oldDelta, source) => {
             if (source !== 'user') return
             socket.emit('send-changes', delta)
         }
         // 102. again doing the same as before
         quill.on('text-change', handler)

         // 93. from the docs of quill's API Event list (Text change event)
         // quill.on('text-change', (delta, oldDelta, source) => {
         //     // 94. source determines if user made these changes or code library made these changes.
         //     // 95. So, making sure if only user made these change.
         //     if (source !== 'user') return
         //     // 96. now emitting a message from client to server and passing the delta that we need.
         //     // 97. delta is just the thing we are changing. It's not the whole document
         //     socket.emit('send-changes', delta)
         // })

         // 98. removing this event listener when we no longer needed
         return() => {
             // 99. also passing the function we want to remove.
             // 100. in our case, the same function that we passed in quill.on
             // 103. also passing that function here now
             quill.off('text-change', handler)
         }
         // 104. and this relies on our socket and quill both.
     }, [socket, quill])




   
  // 17. define useRef wrapper
     // 34. removing useRef now.
     // const wrapper = useRef()

     // 7. creating a new instance of quill, we only wanted to do this once when we render our page
     // 8. adding these empty square brackets so that useEffect will run only one time
     // 9: useEffect is a react hook which trace the side effects if we re-render the page or even a single resource on the page.
     //    it has a function which runs every time the resources are re-rendered.
     //    The second parameter of this react hook is an array (square brackets) [] which takes your choice of resource of the page which changes and you only want to run the function/hook when this resource changes.
     //    So we want it to run only once, hence, we will use an empty array.
     // 28. but useEffect sometimes occurs even before all of your refs are properly set.
     // 29. so it could be a problem that our wrapper is not even defined before useEffect comes into play
     // 30. so instead of using useEffect, we can use a callback.
     // 32. useCallback is going to pass our wrpr inside of it. (also change every wrapper to wrpr inside of the useCallback())
     // 33. also setting it to a wrapper const, and removing useRef.
     // 34. so now, we are going to use a callback function and passing it to our ref in the main return section i.e ref={wrapper} (beside id=container)
     // 36. now we know that wrpr here is always defined.
     // useEffect(() => {
     const wrapper = useCallback((wrpr) => {
         // 40. but first we are making sure if we have a wrpr
         if(wrpr == null) return
         // 39. so at the start we are setting the innerHTML to an empty string every time is runs
         wrpr.innerHTML = ''

         // 18. now with useRef, we can have access to this element and create new elements
         // 19. here, creating a random div
         const editor = document.createElement('div')
         // 20. now this editor will be passed in the new Quill

         // 22. we can not put this editor inside our wrapper
         // 23. using .current use use the current instance which is the current div in the return section
         // 24. and all we wan to append our editor
         // wrapper.current.append(editor)
         // 25. now as soon as the  quill is created, it is going put all inside our id=container including all the toolbars.
         // 37. now wrpr is going to append things
         wrpr.append(editor)

         // 10. new quill will require a selector that is going to be the id of the div that we are returning
         // 11. and added a theme from the quill css
         // 21. passing the const editor to new Quill instead of the id=container
         // new Quill('#container', {theme: 'snow'})
         // 49. now we have a modules property and inside od it there is a toolbar property by quill.
       // 50: so we have set the toolbar property with our toolbar features
       const q = new Quill(editor, {theme: 'snow', modules: {toolbar: toolbarFeatures}})

        // 131. disabling pur editor until the doc is loaded
        q.disable()
        // 132. and setting text of loading
        q.setText('Loading...')
        // 90. doing the same thing with quill
         setQuill(q)

         // 38. but in useCallback, we don't have a return style cleanup.
         // 41. so removing this return cleanup. And now it runs great!
         // 26. hence, now we can clean everything inside our main div i.e, id=container every time useEffect runs.
         // 27. for that, returning while setting the html to an empty string.
         // return () =>{
         // wrapper.innerHTML = ''
         // }
     }, [])
     // 6. added an id to the div

     // 13. now all this div will be wrapped by the quill text editor frame/element/toolbar.
     // 14. but if we re-render our app, it will start adding more of those toolbars for every new render.
     // 15. What we can do is to put our editor inside this id=container
     // 16. uesRef is another react hook. It keeps a counts how many times we've re-render a resource.
     // 35. as soon as this element rendered on the page, it will call our callback function and pass that element to our callback function. 
   // 43. changing this id to class as we've create a .css for it in between
   return <div class="container" ref={wrapper}>
       This is the text editor
   </div>;
}