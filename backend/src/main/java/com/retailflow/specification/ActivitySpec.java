package com.retailflow.specification;

import com.retailflow.model.Activity;
import org.springframework.data.jpa.domain.Specification;

public class ActivitySpec {

    public static Specification<Activity> hasStatus(Activity.Status status) {
        return (root, query, cb) ->
                status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Activity> hasType(Activity.Type type) {
        return (root, query, cb) ->
                type == null ? cb.conjunction() : cb.equal(root.get("type"), type);
    }

    public static Specification<Activity> hasAssignedTo(Long assignedToId) {
        return (root, query, cb) ->
                assignedToId == null ? cb.conjunction() : cb.equal(root.get("assignedTo").get("id"), assignedToId);
    }

    public static Specification<Activity> hasCustomer(Long customerId) {
        return (root, query, cb) ->
                customerId == null ? cb.conjunction() : cb.equal(root.get("customer").get("id"), customerId);
    }
}
