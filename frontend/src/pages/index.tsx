"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, FileText, Clock } from "lucide-react"
import { useToast } from "../../../frontend/src/hooks/useToast"

interface Snippet {
  id: string
  text: string
  summary: string
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function Home() {
  const [text, setText] = useState("")
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/snippets`)
      if (response.ok) {
        const data = await response.json()
        setSnippets(data.snippets || [])
      } else {
        throw new Error("Failed to fetch snippets")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load snippets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createSnippet = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to summarize",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch(`${API_BASE_URL}/snippets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (response.ok) {
        const newSnippet = await response.json()
        setSnippets((prev) => [newSnippet, ...prev])
        setText("")
        toast({
          title: "Success",
          description: "Snippet created and summarized!",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create snippet")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create snippet",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateText = (text: string, maxLength = 200) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Text Summarizer</h1>
          <p className="text-muted-foreground">Paste your text and get AI-powered summaries instantly</p>
        </div>

        {/* Create Snippet Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Snippet
            </CardTitle>
            <CardDescription>Enter your text below and we'll generate a concise summary using AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your blog draft, transcript, or any text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] resize-none"
              maxLength={10000}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{text.length}/10,000 characters</span>
              <Button onClick={createSnippet} disabled={isCreating || !text.trim()} className="min-w-[120px]">
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Snippet"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Snippets List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h2 className="text-2xl font-semibold text-foreground">Your Snippets ({snippets.length})</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : snippets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No snippets yet</h3>
                <p className="text-muted-foreground">Create your first snippet by pasting some text above</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {snippets.map((snippet) => (
                <Card key={snippet.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          Summary
                        </Badge>
                        <p className="text-sm font-medium text-foreground">{snippet.summary}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(snippet.createdAt)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Original Text</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{truncateText(snippet.text)}</p>
                      {snippet.text.length > 200 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                          onClick={() => {
                            // In a real app, this would open a modal or navigate to a detail page
                            alert(`Full text:\n\n${snippet.text}`)
                          }}
                        >
                          Read more
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
