package com.tenpearls.contactmanagementbackend.Repository;

import com.tenpearls.contactmanagementbackend.entity.contact;
import com.tenpearls.contactmanagementbackend.entity.user;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<contact, Long> {

    @Query(value = "SELECT DISTINCT c FROM contact c LEFT JOIN FETCH c.emails WHERE c.user = :user",
            countQuery = "SELECT COUNT(c) FROM contact c WHERE c.user = :user")
    Page<contact> findByUser(@Param("user") user user, Pageable pageable);

    @Query("SELECT c FROM contact c LEFT JOIN FETCH c.emails WHERE c.id = :id")
    Optional<contact> findByIdWithEmails(@Param("id") Long id);

    @Query(value = "SELECT DISTINCT c FROM contact c LEFT JOIN FETCH c.emails WHERE c.user = :user AND " +
            "(LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')))",
            countQuery = "SELECT COUNT(c) FROM contact c WHERE c.user = :user AND " +
                    "(LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<contact> searchByKeyword(@Param("user") user user, @Param("keyword") String keyword, Pageable pageable);
}