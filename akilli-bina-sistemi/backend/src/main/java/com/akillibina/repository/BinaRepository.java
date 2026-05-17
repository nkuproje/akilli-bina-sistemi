package com.akillibina.repository;
import com.akillibina.entity.Bina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BinaRepository extends JpaRepository<Bina, Long> {
    List<Bina> findAll();
}
