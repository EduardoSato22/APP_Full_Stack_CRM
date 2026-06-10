package com.retailflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers",
        uniqueConstraints = @UniqueConstraint(columnNames = {"email", "user_id"}))
@SQLDelete(sql = "UPDATE customers SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    public enum Status { LEAD, PROSPECT, ACTIVE, INACTIVE, CHURNED }
    public enum Source { ORGANIC, REFERRAL, ADS, COLD_OUTREACH, EVENT, OTHER }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    private Integer age;
    private String phone;
    private String company;
    private String position;

    @Column(name = "photo_url", length = 512)
    private String photoUrl;

    // Address embedded
    @Column(name = "addr_street") private String street;
    @Column(name = "addr_city")   private String city;
    @Column(name = "addr_state")  private String state;
    @Column(name = "addr_zip")    private String zipCode;
    @Column(name = "addr_country") private String country;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.LEAD;

    @Enumerated(EnumType.STRING)
    private Source source = Source.ORGANIC;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "customer_tags", joinColumns = @JoinColumn(name = "customer_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "total_revenue", precision = 15, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "last_contact_date")
    private LocalDateTime lastContactDate;

    @Column(name = "next_follow_up_date")
    private LocalDateTime nextFollowUpDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = createdAt;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}