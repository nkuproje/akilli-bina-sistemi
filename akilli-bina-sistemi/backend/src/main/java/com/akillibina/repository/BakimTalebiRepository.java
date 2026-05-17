package com.akillibina.repository;
import com.akillibina.entity.BakimTalebi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BakimTalebiRepository extends JpaRepository<BakimTalebi, Long> {
    List<BakimTalebi> findByDaireId(Long daireId);
    List<BakimTalebi> findBySakinId(Long sakinId);
    List<BakimTalebi> findByDurum(BakimTalebi.TalepDurumu durum);
    List<BakimTalebi> findByDurumIn(List<BakimTalebi.TalepDurumu> durumlar);
    long countByDurum(BakimTalebi.TalepDurumu durum);
    @Query("SELECT b FROM BakimTalebi b ORDER BY b.oncelik DESC, b.olusturmaTarihi ASC")
    List<BakimTalebi> findAllOrderByOncelik();
}
