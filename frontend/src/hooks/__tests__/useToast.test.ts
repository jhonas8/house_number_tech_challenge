import { renderHook, act } from '@testing-library/react'
import { useToast } from '../useToast'

describe('useToast Hook - Toast Management and State', () => {
  beforeEach(() => {
    // Clear any existing toasts
    document.body.innerHTML = ''
  })

  it('should initialize with an empty toasts array when hook is first called', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toasts).toEqual([])
  })

  it('should add a new toast to the list when toast function is called with title and description', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description'
      })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject({
      id: expect.any(String),
      title: 'Test Title',
      description: 'Test Description',
      variant: 'default'
    })
  })

  it('should create toast with custom variant when destructive variant is specified', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      })
    })

    expect(result.current.toasts[0]).toMatchObject({
      variant: 'destructive'
    })
  })

  it('should remove a specific toast from the list when dismiss function is called with toast ID', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description'
      })
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      result.current.dismiss(result.current.toasts[0].id)
    })

    expect(result.current.toasts).toHaveLength(0)
  })
}) 