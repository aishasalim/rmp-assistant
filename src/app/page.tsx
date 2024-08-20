'use client'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../utils/firebase.js' 
import { signOut } from "firebase/auth";
import { CircularProgress } from '@mui/material';


export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login') // Redirect to login if not signed in
      }
    })

    // Cleanup subscription on component unmount
    return () => unsubscribe()
  }, [router])

  // We'll add more code here in the following steps
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''},
    ])
  
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''
  
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {...lastMessage, content: lastMessage.content + text},
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login') // Redirect to login if not signed in
      } else {
        setLoading(false) // Set loading to false if user is signed in
      }
    })

    // Cleanup subscription on component unmount
    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }
  

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
          {/* Sign-Out Button */}
    <Button
      variant="contained"
      color="secondary"
      onClick={handleSignOut}
      sx={{ position: 'absolute', top: 20, right: 20 }}
    >
      Sign Out
    </Button>
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}