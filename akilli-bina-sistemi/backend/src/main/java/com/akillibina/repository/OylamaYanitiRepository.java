package com.akillibina.repository;
import com.akillibina.entity.OylamaYaniti;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface OylamaYanitiRepository extends JpaRepository<OylamaYaniti, Long> {
    List<OylamaYaniti> findByOylamaId(Long oylamaId);
    Optional<OylamaYaniti> findByOylamaIdAndKullaniciId(Long oylamaId, Long kullaniciId);
    boolean existsByOylamaIdAndKullaniciId(Long oylamaId, Long kullaniciId);
    long countByOylamaIdAndSecilenSecenek(Long oylamaId, String secenek);
}
