package com.tenpearls.contactmanagementbackend.Repository;

import com.tenpearls.contactmanagementbackend.entity.contactEmail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactEmailRepository extends JpaRepository<contactEmail, Long> {
}
