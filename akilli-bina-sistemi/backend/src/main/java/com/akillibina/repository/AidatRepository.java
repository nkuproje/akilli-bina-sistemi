package com.akillibina.repository;
import com.akillibina.entity.Aidat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AidatRepository extends JpaRepository<Aidat, Long> {
    List<Aidat> findByDaireId(Long daireId);
    List<Aidat> findByDaireIdAndDurum(Long daireId, Aidat.AidatDurumu durum);
    List<Aidat> findByDonemAyAndDonemYil(Integer ay, Integer yil);
    List<Aidat> findByDurum(Aidat.AidatDurumu durum);
    @Query("SELECT SUM(a.tutar) FROM Aidat a WHERE a.durum = 'ODENDI' AND a.donemYil = :yil")
    Double sumOdenenAidatByYil(@Param("yil") Integer yil);
    @Query("SELECT SUM(a.tutar) FROM Aidat a WHERE a.durum = 'BEKLIYOR'")
    Double sumBekleyenAidat();
    @Query("SELECT COUNT(a) FROM Aidat a WHERE a.durum = 'GECIKTI'")
    Long countGecikmisPl();
}
