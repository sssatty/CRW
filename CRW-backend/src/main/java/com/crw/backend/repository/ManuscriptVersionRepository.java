package com.crw.backend.repository;

import com.crw.backend.entity.ManuscriptVersion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManuscriptVersionRepository extends JpaRepository<ManuscriptVersion, Long> {
}
