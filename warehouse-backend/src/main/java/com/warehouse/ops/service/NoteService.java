package com.warehouse.ops.service;

import com.warehouse.ops.dto.request.CreateNoteRequest;
import com.warehouse.ops.entity.*;
import com.warehouse.ops.exception.ResourceNotFoundException;
import com.warehouse.ops.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final TicketRepository ticketRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Note create(UUID ticketId, CreateNoteRequest req, User actor) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket", ticketId));

        Note note = new Note();
        note.setTicket(ticket);
        note.setUser(actor);
        note.setNoteText(req.getNoteText());

        Note saved = noteRepository.save(note);
        auditLogService.log(ticket, actor, "NOTE_ADDED",
            actor.getFullName() + " added a note.");
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Note> getByTicket(UUID ticketId) {
        return noteRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }
}
