package com.tenpearls.contactmanagementbackend.Repository;

import com.tenpearls.contactmanagementbackend.entity.ContactPhone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactPhoneRepository extends JpaRepository<ContactPhone, Long> {
}
