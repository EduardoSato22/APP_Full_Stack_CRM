package com.retailflow.specification;

import com.retailflow.model.Deal;
import com.retailflow.model.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class DealSpec {

    public static Specification<Deal> isVisibleToUser(Long userId) {
        return (root, query, cb) -> {
            Join<Deal, User> assignedJoin = root.join("assignedTo", JoinType.LEFT);
            query.distinct(true);
            return cb.or(
                    cb.equal(root.get("createdBy").get("id"), userId),
                    cb.equal(assignedJoin.get("id"), userId)
            );
        };
    }

    public static Specification<Deal> hasStage(Deal.Stage stage) {
        return (root, query, cb) ->
                stage == null ? cb.conjunction() : cb.equal(root.get("stage"), stage);
    }

    public static Specification<Deal> hasAssignedTo(Long assignedToId) {
        return (root, query, cb) ->
                assignedToId == null ? cb.conjunction() : cb.equal(root.get("assignedTo").get("id"), assignedToId);
    }
}
