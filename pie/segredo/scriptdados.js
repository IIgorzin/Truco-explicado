const fileData = [
            {
                name: 'AndroidManifest.xml',
                code: `
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.example.apptruco">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppTruco"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity android:name=".FimPartidaActivity">
        </activity>

    </application>
</manifest>
                `.trim(),
            },
            {
                name: 'MainActivity.java',
                code: `
package com.example.apptruco;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private Button buttontruco, button6, button9, button12, buttonResetRodada;
    private Button button1pteq1, button1pteq2;
    private TextView ptseq1, ptseq2;
    private int pontosEquipe1 = 0;
    private int pontosEquipe2 = 0;
    private int valorRodada = 1;

    private boolean jogoFinalizado = false; // Controle para evitar múltiplas finalizações

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Inicialização dos componentes
        buttontruco = findViewById(R.id.buttontruco);
        button6 = findViewById(R.id.button6);
        button9 = findViewById(R.id.button9);
        button12 = findViewById(R.id.button12);
        buttonResetRodada = findViewById(R.id.buttonResetRodada);
        ptseq1 = findViewById(R.id.ptseq1);
        ptseq2 = findViewById(R.id.ptseq2);
        button1pteq1 = findViewById(R.id.button1pteq1);
        button1pteq2 = findViewById(R.id.button1pteq2);

        // Configuração inicial dos textos e botões
        ptseq1.setText(String.valueOf(pontosEquipe1));
        ptseq2.setText(String.valueOf(pontosEquipe2));
        atualizarTextoBotao1Ponto();
        resetarBotao();

        // Listeners dos botões de truco
        buttontruco.setOnClickListener(v -> {
            if (jogoFinalizado) return;
            valorRodada = 3;
            atualizarTextoBotao1Ponto();
            buttontruco.setVisibility(View.GONE);
            button6.setVisibility(View.VISIBLE);
            button9.setVisibility(View.GONE);
            button12.setVisibility(View.GONE);
            buttonResetRodada.setVisibility(View.GONE);
        });
        button6.setOnClickListener(v -> {
            if (jogoFinalizado) return;
            valorRodada = 6;
            atualizarTextoBotao1Ponto();
            buttontruco.setVisibility(View.GONE);
            button6.setVisibility(View.GONE);
            button9.setVisibility(View.VISIBLE);
            button12.setVisibility(View.GONE);
            buttonResetRodada.setVisibility(View.GONE);
        });
        button9.setOnClickListener(v -> {
            if (jogoFinalizado) return;
            valorRodada = 9;
            atualizarTextoBotao1Ponto();
            buttontruco.setVisibility(View.GONE);
            button6.setVisibility(View.GONE);
            button9.setVisibility(View.GONE);
            button12.setVisibility(View.VISIBLE);
            buttonResetRodada.setVisibility(View.GONE);
        });
        button12.setOnClickListener(v -> {
            if (jogoFinalizado) return;
            valorRodada = 12;
            atualizarTextoBotao1Ponto();
            buttontruco.setVisibility(View.GONE);
            button6.setVisibility(View.GONE);
            button9.setVisibility(View.GONE);
            button12.setVisibility(View.GONE);
            buttonResetRodada.setVisibility(View.VISIBLE);
        });
        buttonResetRodada.setOnClickListener(v -> {
            if (jogoFinalizado) return;
            valorRodada = 1;
            atualizarTextoBotao1Ponto();
            resetarBotao();
        });

        // Listeners dos botões de pontuação
        button1pteq1.setOnClickListener(v -> {
            if (jogoFinalizado) return;

            pontosEquipe1 += valorRodada;
            ptseq1.setText(String.valueOf(pontosEquipe1));

            String vencedor = null;
            if (pontosEquipe1 >= 12) {
                if (pontosEquipe2 >= 12) {
                    vencedor = (pontosEquipe1 >= pontosEquipe2) ? "DUPLA 1" : "DUPLA 2";
                } else {
                    vencedor = "DUPLA 1";
                }
            } else if (pontosEquipe2 >= 12) {
                vencedor = "DUPLA 2";
            }

            if (vencedor != null) {
                iniciarFimDePartida(vencedor);
            } else {
                valorRodada = 1;
                atualizarTextoBotao1Ponto();
                resetarBotao();
            }
        });

        button1pteq2.setOnClickListener(v -> {
            if (jogoFinalizado) return;

            pontosEquipe2 += valorRodada;
            ptseq2.setText(String.valueOf(pontosEquipe2));

            String vencedor = null;
            if (pontosEquipe2 >= 12) {
                if (pontosEquipe1 >= 12) {
                    vencedor = (pontosEquipe2 >= pontosEquipe1) ? "DUPLA 2" : "DUPLA 1";
                } else {
                    vencedor = "DUPLA 2";
                }
            } else if (pontosEquipe1 >= 12) {
                vencedor = "DUPLA 1";
            }

            if (vencedor != null) {
                iniciarFimDePartida(vencedor);
            } else {
                valorRodada = 1;
                atualizarTextoBotao1Ponto();
                resetarBotao();
            }
        });

        // Botões de diminuir pontos
        Button buttondiminuirpteq1 = findViewById(R.id.buttondiminuirpteq1);
        buttondiminuirpteq1.setOnClickListener(v -> {
            if (pontosEquipe1 > 0 && !jogoFinalizado) {
                pontosEquipe1--;
                ptseq1.setText(String.valueOf(pontosEquipe1));
            }
        });

        Button buttondiminuirpteq2 = findViewById(R.id.buttondiminuirpteq2);
        buttondiminuirpteq2.setOnClickListener(v -> {
            if (pontosEquipe2 > 0 && !jogoFinalizado) {
                pontosEquipe2--;
                ptseq2.setText(String.valueOf(pontosEquipe2));
            }
        });
    }

    private void resetarBotao() {
        buttontruco.setVisibility(View.VISIBLE);
        button6.setVisibility(View.GONE);
        button9.setVisibility(View.GONE);
        button12.setVisibility(View.GONE);
        buttonResetRodada.setVisibility(View.GONE);
    }

    private void atualizarTextoBotao1Ponto() {
        if (button1pteq1 != null) {
            button1pteq1.setText("+" + valorRodada);
        }
        if (button1pteq2 != null) {
            button1pteq2.setText("+" + valorRodada);
        }
    }

    private void iniciarFimDePartida(String equipeVencedora) {
        if (jogoFinalizado) {
            return;
        }
        jogoFinalizado = true;

        Intent intent = new Intent(MainActivity.this, FimPartidaActivity.class);
        intent.putExtra("EQUIPE_VENCEDORA", equipeVencedora);
        startActivityForResult(intent, 1);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1 && resultCode == RESULT_OK) {
            pontosEquipe1 = 0;
            pontosEquipe2 = 0;
            valorRodada = 1;
            ptseq1.setText("0");
            ptseq2.setText("0");
            atualizarTextoBotao1Ponto();
            resetarBotao();
            jogoFinalizado = false;
        }
    }
}
                `.trim(),
            },
            {
                name: 'FimPartidaActivity.java',
                code: `
package com.example.apptruco;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView; // IMPORTAR TextView

import androidx.appcompat.app.AppCompatActivity;

public class FimPartidaActivity extends AppCompatActivity {

    private TextView textViewMensagemVencedor;

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fim_partida);

        textViewMensagemVencedor = findViewById(R.id.textViewMensagemVencedor);

        String nomeEquipeVencedora = getIntent().getStringExtra("EQUIPE_VENCEDORA");

        if (nomeEquipeVencedora != null && !nomeEquipeVencedora.isEmpty()) {
            textViewMensagemVencedor.setText("A equipe " + nomeEquipeVencedora + " venceu!");
        } else {
            textViewMensagemVencedor.setText("Resultado da partida indisponível.");
        }

        Button buttonVoltar = findViewById(R.id.buttonVoltar);
        buttonVoltar.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                Intent intent = new Intent();
                setResult(Activity.RESULT_OK, intent);
                finish();
            }
        });
    }
}
                `.trim(),
            },
            {
                name: 'activity_main.xml',
                code: `
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/main_background_brown"
    android:fitsSystemWindows="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:background="@color/black"
        android:gravity="center" >

        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="center"
            android:text="TRUCO!"
            android:textColor="@color/white"
            android:textSize="20sp"/>
    </LinearLayout>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:orientation="horizontal"
        android:gravity="center"
        android:paddingTop="8dp">

        <TextView
            android:id="@+id/texteq1"
            android:layout_width="0dp"
            android:layout_weight="1"
            android:layout_height="wrap_content"
            android:text="DUPLA 1:"
            android:textColor="@color/white"
            android:textAlignment="center"
            android:textSize="28sp" />

        <TextView
            android:id="@+id/texteq2"
            android:layout_width="0dp"
            android:layout_weight="1"
            android:layout_height="wrap_content"
            android:text="DUPLA 2:"
            android:textColor="@color/white"
            android:textAlignment="center"
            android:textSize="28sp"/>
    </LinearLayout>

    <LinearLayout
        android:id="@+id/layoutpontos"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="2"
        android:orientation="horizontal"
        android:gravity="center">

        <TextView
            android:id="@+id/ptseq1"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginEnd="50dp"
            android:gravity="center"
            android:text="0"
            android:textColor="@color/score_green"
            android:textSize="88sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/ptseq2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:gravity="center"
            android:text="0"
            android:textColor="@color/score_green"
            android:textSize="88sp"
            android:textStyle="bold" />
    </LinearLayout>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1.5"
        android:orientation="vertical"
        android:gravity="center">

        <Button
            android:id="@+id/buttontruco"
            style="@style/TrucoButtonStyle"
            android:text="TRUCO!" />

        <Button
            android:id="@+id/button6"
            style="@style/TrucoButtonStyle"
            android:text="SEIS!!"
            android:visibility="gone"/>

        <Button
            android:id="@+id/button9"
            style="@style/TrucoButtonStyle"
            android:text="NOVE!!!"
            android:visibility="gone"/>

        <Button
            android:id="@+id/button12"
            style="@style/TrucoButtonStyle"
            android:text="DOZE!!!!"
            android:visibility="gone"/>

        <Button
            android:id="@+id/buttonResetRodada"
            style="@style/TrucoButtonStyle"
            android:paddingVertical="15dp"
            android:text="Resetar Rodada"
            android:visibility="gone"/>
    </LinearLayout>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="2"
        android:orientation="horizontal"
        android:gravity="center">

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:orientation="vertical"
            android:gravity="center">

            <Button
                android:id="@+id/button1pteq1"
                android:layout_width="80dp"
                android:layout_height="80dp"
                android:text="+1"
                android:textSize="24sp"
                android:backgroundTint="@color/button_plus_brown"
                android:textColor="@color/white"/>

            <Button
                android:id="@+id/buttondiminuirpteq1"
                android:layout_width="60dp"
                android:layout_height="80dp"
                android:text="-1"
                android:textSize="24sp"
                android:backgroundTint="@color/button_minus_red"
                android:textColor="@color/white"
                android:layout_marginTop="8dp"/>
        </LinearLayout>

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:orientation="vertical"
            android:gravity="center" >

            <Button
                android:id="@+id/button1pteq2"
                android:layout_width="80dp"
                android:layout_height="80dp"
                android:text="+1"
                android:textSize="24sp"
                android:backgroundTint="@color/button_plus_brown"
                android:textColor="@color/white"/>

            <Button
                android:id="@+id/buttondiminuirpteq2"
                android:layout_width="60dp"
                android:layout_height="80dp"
                android:text="-1"
                android:textSize="24sp"
                android:backgroundTint="@color/button_minus_red"
                android:textColor="@color/white"
                android:layout_marginTop="8dp"/>
        </LinearLayout>
    </LinearLayout>
</LinearLayout>
                `.trim(),
            },
            {
                name: 'activity_fim_partida.xml',
                code: `
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/end_game_background_brown"
    tools:context=".FimPartidaActivity">

    <TextView
        android:id="@+id/textViewFim"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="FIM DA PARTIDA!!"
        android:textColor="@color/white"
        android:textSize="30sp"
        android:textStyle="bold"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toTopOf="@+id/textViewMensagemVencedor"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintVertical_chainStyle="packed"
        android:layout_marginBottom="20dp"/>

    <TextView
        android:id="@+id/textViewMensagemVencedor"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textColor="@color/white"
        android:textSize="24sp"
        android:textStyle="italic"
        tools:text="A equipe DUPLA 1 venceu!"
        app:layout_constraintTop_toBottomOf="@+id/textViewFim"
        app:layout_constraintBottom_toTopOf="@+id/buttonVoltar"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginBottom="40dp"/>

    <Button
        android:id="@+id/buttonVoltar"
        style="@style/Widget.AppCompat.Button.Colored"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Voltar para o contador"
        android:paddingLeft="20dp"
        android:paddingRight="20dp"
        android:paddingTop="10dp"
        android:paddingBottom="10dp"
        app:layout_constraintTop_toBottomOf="@+id/textViewMensagemVencedor"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
                `.trim(),
            },
            {
                name: 'botao_arrendodado.xml',
                code: `
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/button_truquin" />
    <corners android:radius="50dp"/>
</shape>
                `.trim(),
            },
            {
                name: 'colors.xml',
                code: `
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
    <color name="main_background_brown">#332B2B</color>
    <color name="score_green">#FFFFFFFF</color>
    <color name="button_minus_red">#F41800</color>
    <color name="button_plus_brown">#A04035</color>
    <color name="end_game_background_brown">#332B2B</color>
    <color name="button_truquin">#7A433D</color>
</resources>
                `.trim(),
            },
            {
                name: 'strings.xml',
                code: `
<resources>
    <string name="app_name">AppTruco</string>
</resources>
                `.trim(),
            },
            {
                name: 'themes.xml',
                code: `
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.AppTruco" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
        <item name="colorPrimary">@color/button_truquin</item>
        <item name="colorOnPrimary">@color/white</item>
        <item name="colorOnSecondary">@color/black</item>
        <item name="android:statusBarColor">?attr/colorPrimaryVariant</item>
    </style>

    <style name="TrucoButtonStyle">
        <item name="android:layout_width">wrap_content</item>
        <item name="android:layout_height">wrap_content</item>
        <item name="android:gravity">center</item>
        <item name="android:background">@drawable/botao_arrendodado</item>
        <item name="android:textColor">@color/white</item>
        <item name="android:paddingHorizontal">80dp</item> <item name="android:paddingVertical">20dp</item> <item name="android:layout_marginVertical">4dp</item>
    </style>
</resources>
                `.trim(),
            },
            {
                name: 'values-night/themes.xml',
                code: `
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.AppTruco" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
        <item name="colorPrimary">@color/button_truquin</item> <item name="colorPrimaryVariant">@color/button_truquin</item>
        <item name="colorOnPrimary">@color/black</item>
        <item name="colorSecondary">@color/black</item>
        <item name="colorSecondaryVariant">@color/black</item> <item name="colorOnSecondary">@color/black</item>
        <item name="android:statusBarColor">?attr/colorPrimaryVariant</item>
    </style>
</resources>
                `.trim(),
            }
        ];

        let currentFileIndex = 0; 
        let showCode = false; 
        
        const fileNameElement = document.getElementById('fileName');
        const codeContentElement = document.getElementById('codeContent');
        const codeDisplayElement = document.getElementById('codeDisplay');
        const fileCardElement = document.getElementById('fileCard');
        const arrowIconElement = document.getElementById('arrowIcon');
        const nextFileButton = document.getElementById('nextFileButton');
        const backButton = document.getElementById('backButton');

        function updateFileDisplay() {
            const currentFile = fileData[currentFileIndex];
            if (currentFile) {
                fileNameElement.textContent = currentFile.name;
                codeContentElement.textContent = currentFile.code; 

                const fileExtension = currentFile.name.split('.').pop();
                let languageClass = 'language-text';
                if (fileExtension === 'java') {
                    languageClass = 'language-java';
                } else if (fileExtension === 'xml') {
                    languageClass = 'language-xml';
                }
                codeContentElement.className = `${languageClass} text-green-300 text-sm md:text-base`;

                if (!showCode) {
                    codeDisplayElement.classList.add('hidden');
                    arrowIconElement.classList.remove('rotate-180');
                } else {
                    codeDisplayElement.classList.remove('hidden');
                    arrowIconElement.classList.add('rotate-180');
                }
            } else {
                fileNameElement.textContent = 'Nenhum arquivo encontrado';
                codeContentElement.textContent = '';
                codeDisplayElement.classList.add('hidden');
                arrowIconElement.classList.remove('rotate-180');
            }

            if (fileData.length <= 1) {
                nextFileButton.disabled = true;
                nextFileButton.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                nextFileButton.disabled = false;
                nextFileButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }

        function toggleCodeVisibility() {
            showCode = !showCode;
            if (showCode) {
                codeDisplayElement.classList.remove('hidden');
                arrowIconElement.classList.add('rotate-180');
            } else {
                codeDisplayElement.classList.add('hidden');
                arrowIconElement.classList.remove('rotate-180');
            }
        }

        function goToNextFile() {
            if (fileData.length > 1) {
                currentFileIndex = (currentFileIndex + 1) % fileData.length;
                showCode = false;
                updateFileDisplay();
            }
        }

        fileCardElement.addEventListener('click', toggleCodeVisibility);
        nextFileButton.addEventListener('click', goToNextFile);
   
        document.addEventListener('DOMContentLoaded', updateFileDisplay);