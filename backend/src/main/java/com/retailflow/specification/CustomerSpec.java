package com.retailflow.specification;

import com.retailflow.model.Customer;
import com.retailflow.model.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class CustomerSpec {

    public static Specification<Customer> isVisibleToUser(Long userId) {
        return (root, query, cb) -> {
            Join<Customer, User> assignedJoin = root.join("assignedTo", JoinType.LEFT);
            query.distinct(true);
            return cb.or(
                    cb.equal(root.get("user").get("id"), userId),
                    cb.equal(assignedJoin.get("id"), userId)
            );
        };
    }

    public static Specification<Customer> hasSearch(String search) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(search)) return cb.conjunction();
            String pattern = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("lastName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("company")), pattern)
            );
        };
    }

    public static Specification<Customer> hasStatus(Customer.Status status) {
        return (root, query, cb) ->
                status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }
}
