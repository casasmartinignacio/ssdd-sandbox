"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, getNotes, markNoteNotified, updateNote } from "@/services/notes";

export const notesQueryKey = ["notes"];

export function useNotes() {
  return useQuery({
    queryKey: notesQueryKey,
    queryFn: getNotes,
    select: (data) => data.notes,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notesQueryKey }),
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notesQueryKey }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notesQueryKey }),
  });
}

export function useMarkNoteNotified() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNoteNotified,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notesQueryKey }),
  });
}
