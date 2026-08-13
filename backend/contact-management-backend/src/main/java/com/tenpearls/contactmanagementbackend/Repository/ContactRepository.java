package com.tenpearls.contactmanagementbackend.Repository;

import com.tenpearls.contactmanagementbackend.entity.contact;
import com.tenpearls.contactmanagementbackend.entity.user;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<contact, Long> {

    Page<contact> findByUser(user user, Pageable pageable);

    Page<contact> findByUserAndFirstNameContainingIgnoreCaseOrUserAndLastNameContainingIgnoreCase(
            user user1, String firstName, user user2, String lastName, Pageable pageable);
}
