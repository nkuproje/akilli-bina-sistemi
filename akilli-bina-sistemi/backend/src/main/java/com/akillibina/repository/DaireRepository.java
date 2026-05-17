package com.akillibina.repository;
import com.akillibina.entity.Daire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface DaireRepository extends JpaRepository<Daire, Long> {
    List<Daire> findByBinaId(Long binaId);
    List<Daire> findByDoluFalse();
    Optional<Daire> findByBinaIdAndDaireNo(Long binaId, String daireNo);
}
