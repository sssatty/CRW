package com.crw.backend.repository;

import com.crw.backend.entity.Annotation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnotationRepository extends JpaRepository<Annotation, Long> {
}
