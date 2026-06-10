package com.retailflow.mapper;

import com.retailflow.dto.DealRequest;
import com.retailflow.dto.DealResponse;
import com.retailflow.model.Deal;
import com.retailflow.model.Product;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DealMapper {

    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", expression = "java(d.getCustomer() != null ? d.getCustomer().getFirstName() + \" \" + d.getCustomer().getLastName() : null)")
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    @Mapping(target = "assignedToName", source = "assignedTo.name")
    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "productIds", source = "products")
    DealResponse toResponse(Deal d);

    default List<Long> productIdsFromProducts(List<Product> products) {
        if (products == null) return null;
        return products.stream().map(Product::getId).collect(Collectors.toList());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "probability", ignore = true)
    @Mapping(target = "closedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "value", defaultExpression = "java(java.math.BigDecimal.ZERO)")
    @Mapping(target = "stage", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(DealRequest request, @MappingTarget Deal deal);
}
