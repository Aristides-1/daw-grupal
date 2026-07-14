from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from .models import Receta


def generar_receta_pdf(receta: Receta) -> BytesIO:
    buffer = BytesIO()

    documento = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
        title=f"Receta VetCare #{receta.id}",
        author="VetCare",
    )

    estilos = getSampleStyleSheet()

    estilo_titulo = ParagraphStyle(
        "TituloVetCare",
        parent=estilos["Title"],
        alignment=TA_CENTER,
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#123B62"),
        spaceAfter=4,
    )

    estilo_subtitulo = ParagraphStyle(
        "SubtituloVetCare",
        parent=estilos["Normal"],
        alignment=TA_CENTER,
        fontSize=10,
        textColor=colors.HexColor("#6C757D"),
        spaceAfter=18,
    )

    estilo_seccion = ParagraphStyle(
        "SeccionVetCare",
        parent=estilos["Heading2"],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#123B62"),
        spaceBefore=10,
        spaceAfter=8,
    )

    estilo_texto = ParagraphStyle(
        "TextoVetCare",
        parent=estilos["BodyText"],
        fontSize=10,
        leading=15,
    )

    atencion = receta.atencion
    cita = atencion.cita
    mascota = cita.mascota
    cliente = mascota.cliente
    veterinario = cita.veterinario

    elementos = [
        Paragraph("VetCare", estilo_titulo),
        Paragraph(
            "Sistema Integral de Gestión para Clínicas Veterinarias",
            estilo_subtitulo,
        ),
        Paragraph("RECETA VETERINARIA", estilo_seccion),
    ]

    datos_generales = [
        ["Receta N.º", str(receta.id)],
        ["Fecha de atención", cita.fecha.strftime("%d/%m/%Y")],
        ["Hora", cita.hora.strftime("%H:%M")],
        [
            "Veterinario",
            f"{veterinario.nombres} {veterinario.apellidos}",
        ],
        [
            "Especialidad",
            (
                veterinario.especialidad.nombre
                if veterinario.especialidad
                else "Sin especialidad"
            ),
        ],
    ]

    tabla_general = Table(
        datos_generales,
        colWidths=[5 * cm, 11 * cm],
    )

    tabla_general.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#E8F1FB")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#123B62")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CED4DA")),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )

    elementos.extend(
        [
            tabla_general,
            Spacer(1, 14),
            Paragraph("Datos del paciente", estilo_seccion),
        ]
    )

    datos_paciente = [
        ["Mascota", mascota.nombre],
        ["Especie", mascota.especie],
        ["Raza", mascota.raza],
        ["Sexo", "Macho" if mascota.sexo == "M" else "Hembra"],
        ["Peso", f"{mascota.peso:.2f} kg"],
        [
            "Propietario",
            f"{cliente.nombres} {cliente.apellidos}",
        ],
        ["Documento", cliente.documento],
        ["Teléfono", cliente.telefono],
    ]

    tabla_paciente = Table(
        datos_paciente,
        colWidths=[5 * cm, 11 * cm],
    )

    tabla_paciente.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F3F5")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CED4DA")),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )

    elementos.extend(
        [
            tabla_paciente,
            Spacer(1, 14),
            Paragraph("Diagnóstico", estilo_seccion),
            Paragraph(
                atencion.diagnostico or "No registrado",
                estilo_texto,
            ),
            Spacer(1, 10),
            Paragraph("Medicamentos", estilo_seccion),
            Paragraph(receta.medicamentos, estilo_texto),
            Spacer(1, 10),
            Paragraph("Indicaciones", estilo_seccion),
            Paragraph(receta.indicaciones, estilo_texto),
            Spacer(1, 24),
            Paragraph(
                "__________________________________________",
                ParagraphStyle(
                    "Firma",
                    parent=estilo_texto,
                    alignment=TA_CENTER,
                ),
            ),
            Paragraph(
                f"Dr(a). {veterinario.nombres} {veterinario.apellidos}",
                ParagraphStyle(
                    "NombreVeterinario",
                    parent=estilo_texto,
                    alignment=TA_CENTER,
                ),
            ),
            Paragraph(
                "Médico veterinario",
                ParagraphStyle(
                    "CargoVeterinario",
                    parent=estilo_texto,
                    alignment=TA_CENTER,
                    textColor=colors.HexColor("#6C757D"),
                ),
            ),
        ]
    )

    documento.build(elementos)

    buffer.seek(0)
    return buffer