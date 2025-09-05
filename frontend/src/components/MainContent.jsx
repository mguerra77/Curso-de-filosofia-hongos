function MainContent() {
  return (
    <div className="w-full bg-gradient-to-br from-slate-200 via-gray-200 to-zinc-200 py-16 px-4 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          {/* Imagen de referencia */}
          <div className="w-full lg:w-5/12">
            <img
              src="/curso-hongos.jpg"
              alt="La filosofía secreta de los hongos - Curso de introducción"
              className="w-full h-80 object-cover rounded-lg shadow-xl"
            />
          </div>     

          {/* Contenido descriptivo */}
          <div className="w-full lg:w-7/12">
            <div className="space-y-6 text-gray-700 leading-relaxed text-justify">
              <p className="text-base">
                ¿Alguna vez te preguntaste qué secretos esconden los hongos bajo la superficie? Más allá de su presencia en nuestros platos o en los bosques húmedos, el reino fungi representa uno de los paradigmas más revolucionarios para repensar nuestra relación con el conocimiento, la conciencia y la interconexión de la vida.
                Presentaremos una mirada interdisciplinario que desafía las fronteras tradicionales entre la biología, la filosofía, la psicología y la antropología. A lo largo de cuatro encuentros, vamos a explorar cómo estos fascinantes organismos —que no son ni plantas ni animales— inspiraron nuevas formas de entender la mente humana y nuestro lugar en el ecosistema planetario.
                Desde el micelio como metáfora de conocimiento interconectado hasta el resurgimiento científico del estudio de las propiedades terapéuticas de los hongos, este curso combina rigor académico con preguntas provocadoras: ¿Qué nos enseña la estructura micelial sobre la epistemología en red? ¿Cómo influyeron los hongos en diversas tradiciones culturales a lo largo de la historia? ¿Qué nos dice la investigación contemporánea sobre su potencial transformador?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainContent