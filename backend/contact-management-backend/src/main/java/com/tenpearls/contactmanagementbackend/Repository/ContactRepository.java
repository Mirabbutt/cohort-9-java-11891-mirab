package com.tenpearls.contactmanagementbackend.Repository;

import com.tenpearls.contactmanagementbackend.entity.Contact;
import com.tenpearls.contactmanagementbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query(value = "SELECT DISTINCT c FROM Contact c LEFT JOIN FETCH c.emails WHERE c.user = :user",
            countQuery = "SELECT COUNT(c) FROM Contact c WHERE c.user = :user")
    Page<Contact> findByUser(@Param("user") User user, Pageable pageable);

    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.emails WHERE c.id = :id")
    Optional<Contact> findByIdWithEmails(@Param("id") Long id);

    @Query(value = "SELECT DISTINCT c FROM Contact c LEFT JOIN FETCH c.emails WHERE c.user = :user AND " +
            "(LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')))",
            countQuery = "SELECT COUNT(c) FROM Contact c WHERE c.user = :user AND " +
                    "(LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Contact> searchByKeyword(@Param("user") User user, @Param("keyword") String keyword, Pageable pageable);
}