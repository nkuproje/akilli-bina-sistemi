package com.akillibina.repository;
import com.akillibina.entity.Duyuru;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface DuyuruRepository extends JpaRepository<Duyuru, Long> {
    List<Duyuru> findByAktifTrueOrderByOlusturmaTarihiDesc();
    List<Duyuru> findByOnemliTrueAndAktifTrue();
}
