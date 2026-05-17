package com.akillibina.repository;
import com.akillibina.entity.Gider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface GiderRepository extends JpaRepository<Gider, Long> {
    List<Gider> findByBinaIdOrderByGiderTarihiDesc(Long binaId);
    @Query("SELECT g FROM Gider g WHERE g.bina.id = :binaId AND YEAR(g.giderTarihi) = :yil")
    List<Gider> findByBinaIdAndYil(@Param("binaId") Long binaId, @Param("yil") Integer yil);
    @Query("SELECT SUM(g.tutar) FROM Gider g WHERE YEAR(g.giderTarihi) = :yil")
    Double sumByYil(@Param("yil") Integer yil);
    @Query("SELECT g.kategori, SUM(g.tutar) FROM Gider g WHERE YEAR(g.giderTarihi) = :yil GROUP BY g.kategori")
    List<Object[]> sumByKategoriAndYil(@Param("yil") Integer yil);
}
