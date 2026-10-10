export default function Help({ length, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog help" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2>Nasıl oynanır?</h2>
        <p>
          Gizli ülkeyi 6 denemede bul. Tahminler <b>{length} harfli, İngilizce</b> ülke isimleri olmalı (ör. JAPAN, CHILE).
        </p>
        <div className="help-tiles">
          <div className="tile correct">J</div> harf doğru yerde
        </div>
        <div className="help-tiles">
          <div className="tile present">A</div> harf kelimede var ama başka yerde
        </div>
        <div className="help-tiles">
          <div className="tile absent">N</div> harf kelimede yok
        </div>
        <p>
          Her tahminin yanında gizli ülkeye olan <b>mesafe</b>, <b>yön</b> ve <b>yakınlık yüzdesi</b> görünür. Tahmin ettiğin
          ülkeler haritada işaretlenir; birine tıklayınca bilgilerini görürsün.
        </p>
        <p>
          🤖 Yapay zekâ hakem, yanlış yazdığın ülkeleri tanır ve <i>"Sanırım şunu demek istedin"</i> der. Ülke olmayan
          kelimeler ve yanlış uzunluktaki ülkeler deneme hakkından düşmez.
        </p>
        <div className="dialog-actions">
          <button className="btn primary" onClick={onClose} autoFocus>
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
}
