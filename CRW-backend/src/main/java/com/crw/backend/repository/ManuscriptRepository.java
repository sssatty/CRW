package com.crw.backend.repository;

import com.crw.backend.entity.Manuscript;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ManuscriptRepository extends JpaRepository<Manuscript, Long> {

    List<Manuscript> findByWorkspaceId(Long workspaceId);
}
