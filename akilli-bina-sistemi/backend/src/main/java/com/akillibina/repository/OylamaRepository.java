package com.akillibina.repository;
import com.akillibina.entity.Oylama;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface OylamaRepository extends JpaRepository<Oylama, Long> {
    List<Oylama> findByDurumOrderByOlusturmaTarihiDesc(Oylama.OylamaDurumu durum);
    List<Oylama> findAllByOrderByOlusturmaTarihiDesc();
}
