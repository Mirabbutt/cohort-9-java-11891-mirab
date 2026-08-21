package com.tenpearls.contactmanagementbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString; import lombok.EqualsAndHashCode;

@Entity
@Table(name = "contact_phones")
@Data
@ToString(exclude = "contact")
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
public class ContactPhone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String phoneNumber;

    private String label; // work, home, personal

    @ManyToOne
    @JoinColumn(name = "contact_id", nullable = false)
    @JsonIgnore
    private Contact contact;
}
