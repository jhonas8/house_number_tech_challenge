"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, FileText, Clock } from "lucide-react"
import { useToastContext } from "@/components/ui/toast-provider"
import { SnippetService } from "@/services/snippetService"
import { Snippet } from "@/types/snippet"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HomePage() {
  const [text, setText] = useState("")
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToastContext()
  const snippetService = useMemo(() => new SnippetService(API_BASE_URL), [])

  const fetchSnippets = useCallback(async () => {
    try {
      const response = await snippetService.getAllSnippets()
      setSnippets(response.snippets || [])
    } catch {
      toast({
        title: "Error",
        description: "Failed to load snippets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [snippetService, toast])

  useEffect(() => {
    fetchSnippets()
  }, [fetchSnippets])

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
      const newSnippet = await snippetService.createSnippet({ text: text.trim() })
      setSnippets((prev) => [newSnippet, ...prev])
      setText("")
      toast({
        title: "Success",
        description: "Snippet created and summarized!",
        variant: "success",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to create snippet",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Text Summarizer 🚀 SIMPLIFIED DOCKER!</h1>
          <p className="text-slate-600">Paste your text and get AI-powered summaries instantly</p>
        </div>

        {/* Create Snippet Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Snippet
            </CardTitle>
            <CardDescription>Enter your text below and we&apos;ll generate a concise summary using AI</CardDescription>
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
              <span className="text-sm text-slate-500">{text.length}/10,000 characters</span>
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
            <h2 className="text-2xl font-semibold text-slate-900">Your Snippets ({snippets.length})</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : snippets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No snippets yet</h3>
                <p className="text-slate-500">Create your first snippet by pasting some text above</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {snippets.filter(Boolean).map((snippet) => (
                <Card key={snippet.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          Summary
                        </Badge>
                        <p className="text-sm font-medium text-slate-900">{snippet.summary}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {formatDate(snippet.createdAt)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Original Text</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{truncateText(snippet.text)}</p>
                      {snippet.text.length > 200 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
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
