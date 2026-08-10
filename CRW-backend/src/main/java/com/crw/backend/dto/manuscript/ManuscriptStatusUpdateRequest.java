package com.crw.backend.dto.manuscript;

import com.crw.backend.entity.ManuscriptStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManuscriptStatusUpdateRequest {

    @NotNull
    private ManuscriptStatus status;
}
