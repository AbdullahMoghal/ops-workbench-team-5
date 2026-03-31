package com.warehouse.ops.repository;

import com.warehouse.ops.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<Note, UUID> {
    List<Note> findByTicketIdOrderByCreatedAtAsc(UUID ticketId);
}
