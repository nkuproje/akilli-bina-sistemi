package com.akillibina.repository;
import com.akillibina.entity.EnerjiOkuma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface EnerjiOkumaRepository extends JpaRepository<EnerjiOkuma, Long> {
    // Bina geneli (daire_id IS NULL) — yönetici görünümü
    List<EnerjiOkuma> findByBinaIdAndDaireIsNullOrderByOkumaTarihiDesc(Long binaId);
    // Daire bazlı — sakin görünümü
    List<EnerjiOkuma> findByDaireIdOrderByOkumaTarihiDesc(Long daireId);
    // Eski compat
    List<EnerjiOkuma> findByBinaIdOrderByOkumaTarihiDesc(Long binaId);
    List<EnerjiOkuma> findByBinaIdAndDonemYil(Long binaId, Integer yil);
    List<EnerjiOkuma> findByDaireIdAndDonemYil(Long daireId, Integer yil);
    @Query("SELECT e FROM EnerjiOkuma e WHERE e.bina.id = :binaId ORDER BY e.okumaTarihi DESC")
    List<EnerjiOkuma> findSonOkumalar(@Param("binaId") Long binaId);
    @Query("SELECT SUM(e.toplamMaliyet) FROM EnerjiOkuma e WHERE e.donemYil = :yil")
    Double sumToplamMaliyetByYil(@Param("yil") Integer yil);
}
