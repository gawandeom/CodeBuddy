# CodeBuddy

A CLI coding assistant that reads a file, proposes an AI-generated
improvement based on your instruction, shows a coloured diff, and
only writes the change after you approve it.

## Why
Most AI coding tools apply changes blindly. CodeBuddy always shows
you the diff first — you're always in control.

## Install
git clone <your repo url>
cd codebuddy
npm install
cp .env.example .env   # add your GROQ_API_KEY
npm link

## Usage
codebuddy --file calc.ts --task "add input validation"

## How it works
1. Reads the target file
2. Sends it + your instruction to an LLM agent (via LangChain + Groq)
3. Shows a colored diff of the proposed change
4. Only writes the file if you approve (y/n)

## Built with
LangChain, LangGraph, TypeScript, Commander, Groq