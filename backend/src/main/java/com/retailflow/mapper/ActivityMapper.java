package com.retailflow.mapper;

import com.retailflow.dto.ActivityRequest;
import com.retailflow.dto.ActivityResponse;
import com.retailflow.model.Activity;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ActivityMapper {

    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", expression = "java(a.getCustomer() != null ? a.getCustomer().getFirstName() + \" \" + a.getCustomer().getLastName() : null)")
    @Mapping(target = "dealId", source = "deal.id")
    @Mapping(target = "dealTitle", source = "deal.title")
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    @Mapping(target = "assignedToName", source = "assignedTo.name")
    @Mapping(target = "createdById", source = "createdBy.id")
    ActivityResponse toResponse(Activity a);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "deal", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "priority", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(ActivityRequest request, @MappingTarget Activity activity);
}
