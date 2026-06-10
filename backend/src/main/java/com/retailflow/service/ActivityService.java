package com.retailflow.service;

import com.retailflow.dto.ActivityRequest;
import com.retailflow.dto.ActivityResponse;
import com.retailflow.model.Activity;
import com.retailflow.model.User;
import com.retailflow.repository.ActivityRepository;
import com.retailflow.repository.CustomerRepository;
import com.retailflow.repository.DealRepository;
import com.retailflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public Page<ActivityResponse> list(Activity.Status status, Activity.Type type, Long assignedToId, Long customerId, Pageable pageable) {
        return activityRepository.findFiltered(
        status != null ? status.name() : null,
        type != null ? type.name() : null,
        assignedToId, customerId, pageable)
                .map(ActivityResponse::fromEntity);
    }

    public List<ActivityResponse> getOverdue() {
        return activityRepository.findOverdue(LocalDateTime.now())
                .stream().map(ActivityResponse::fromEntity).toList();
    }

    public List<ActivityResponse> getUpcoming(int days) {
        LocalDateTime now = LocalDateTime.now();
        return activityRepository.findUpcoming(now, now.plusDays(days))
                .stream().map(ActivityResponse::fromEntity).toList();
    }

    @Transactional
    public ActivityResponse create(ActivityRequest request) {
        User user = getCurrentUser();
        Activity activity = new Activity();
        mapToEntity(activity, request);
        activity.setCreatedBy(user);
        return ActivityResponse.fromEntity(activityRepository.save(activity));
    }

    @Transactional
    public ActivityResponse update(Long id, ActivityRequest request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada"));
        mapToEntity(activity, request);
        return ActivityResponse.fromEntity(activityRepository.save(activity));
    }

    @Transactional
    public ActivityResponse complete(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada"));
        activity.setStatus(Activity.Status.DONE);
        activity.setCompletedAt(LocalDateTime.now());
        return ActivityResponse.fromEntity(activityRepository.save(activity));
    }

    private void mapToEntity(Activity a, ActivityRequest r) {
        a.setType(r.getType());
        a.setTitle(r.getTitle());
        a.setDescription(r.getDescription());
        a.setDueDate(r.getDueDate());
        if (r.getPriority() != null) a.setPriority(r.getPriority());
        if (r.getCustomerId() != null) customerRepository.findById(r.getCustomerId()).ifPresent(a::setCustomer);
        if (r.getDealId() != null) dealRepository.findById(r.getDealId()).ifPresent(a::setDeal);
        if (r.getAssignedToId() != null) userRepository.findById(r.getAssignedToId()).ifPresent(a::setAssignedTo);
    }
}