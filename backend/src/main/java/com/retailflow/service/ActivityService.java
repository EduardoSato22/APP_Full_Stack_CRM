package com.retailflow.service;

import com.retailflow.dto.ActivityRequest;
import com.retailflow.dto.ActivityResponse;
import com.retailflow.exception.ResourceNotFoundException;
import com.retailflow.mapper.ActivityMapper;
import com.retailflow.model.Activity;
import com.retailflow.model.User;
import com.retailflow.repository.ActivityRepository;
import com.retailflow.repository.CustomerRepository;
import com.retailflow.repository.DealRepository;
import com.retailflow.repository.UserRepository;
import com.retailflow.specification.ActivitySpec;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    private final ActivityMapper activityMapper;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public String currentUserName() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Transactional(readOnly = true)
    public Page<ActivityResponse> list(Activity.Status status, Activity.Type type, Long assignedToId, Long customerId, Pageable pageable) {
        Specification<Activity> spec = ActivitySpec.hasStatus(status)
                .and(ActivitySpec.hasType(type))
                .and(ActivitySpec.hasAssignedTo(assignedToId))
                .and(ActivitySpec.hasCustomer(customerId));
        return activityRepository.findAll(spec, pageable).map(activityMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getOverdue() {
        return activityRepository.findOverdue(LocalDateTime.now())
                .stream().map(activityMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getUpcoming(int days) {
        LocalDateTime now = LocalDateTime.now();
        return activityRepository.findUpcoming(now, now.plusDays(days))
                .stream().map(activityMapper::toResponse).toList();
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", key = "#root.target.currentUserName()")
    public ActivityResponse create(ActivityRequest request) {
        User user = getCurrentUser();
        Activity activity = new Activity();
        activityMapper.updateEntity(request, activity);
        resolveRelationships(request, activity);
        activity.setCreatedBy(user);
        return activityMapper.toResponse(activityRepository.save(activity));
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", key = "#root.target.currentUserName()")
    public ActivityResponse update(Long id, ActivityRequest request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada"));
        activityMapper.updateEntity(request, activity);
        resolveRelationships(request, activity);
        return activityMapper.toResponse(activityRepository.save(activity));
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", key = "#root.target.currentUserName()")
    public ActivityResponse complete(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada"));
        activity.setStatus(Activity.Status.DONE);
        activity.setCompletedAt(LocalDateTime.now());
        return activityMapper.toResponse(activityRepository.save(activity));
    }

    private void resolveRelationships(ActivityRequest request, Activity activity) {
        if (request.getCustomerId() != null) customerRepository.findById(request.getCustomerId()).ifPresent(activity::setCustomer);
        if (request.getDealId() != null) dealRepository.findById(request.getDealId()).ifPresent(activity::setDeal);
        if (request.getAssignedToId() != null) userRepository.findById(request.getAssignedToId()).ifPresent(activity::setAssignedTo);
    }
}
