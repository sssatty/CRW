package com.crw.backend.repository;

import com.crw.backend.entity.Literature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LiteratureRepository extends JpaRepository<Literature, Long> {

    List<Literature> findByWorkspaceId(Long workspaceId);
}
