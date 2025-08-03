// app/api/plan/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

export async function POST(req: NextRequest) {
  const formData = await req.json()

  return new Promise((resolve) => {
    const python = spawn('python3', ['backend/gpt-planner.py', JSON.stringify(formData)])

    let result = ''
    let error = ''

    python.stdout.on('data', (data) => {
      result += data.toString()
    })

    python.stderr.on('data', (data) => {
      error += data.toString()
    })

    python.on('close', (code) => {
      if (code !== 0) {
        resolve(
          NextResponse.json({ error: 'Python error', details: error }, { status: 500 })
        )
      } else {
        resolve(NextResponse.json({ result }))
      }
    })
  })
}