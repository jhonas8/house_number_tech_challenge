import { renderHook, act } from '@testing-library/react'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    // Clear any existing toasts
    document.body.innerHTML = ''
  })

  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toasts).toEqual([])
  })

  it('should add a toast when toast function is called', () => {
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

  it('should add toast with custom variant', () => {
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

  it('should remove a toast when dismiss is called', () => {
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

  it('should auto-dismiss toasts after default duration', () => {
    jest.useFakeTimers()
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description'
      })
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      jest.advanceTimersByTime(5000) // Default duration
    })

    expect(result.current.toasts).toHaveLength(0)

    jest.useRealTimers()
  })

  it('should not auto-dismiss when duration is set to null', () => {
    jest.useFakeTimers()
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
        duration: null
      })
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      jest.advanceTimersByTime(10000) // Longer than default
    })

    expect(result.current.toasts).toHaveLength(1)

    jest.useRealTimers()
  })
}) 