import { defineStore } from 'pinia';

export const useProyectosStore = defineStore('proyectos', {
  state: () => ({
    proyectos: [] as { 
      id: string, 
      nombre: string, 
      tareas: { id: string; nombre: string; completada: boolean; fechaHoraRegistro: Date }[], 
      progreso: number 
    }[],
  }),

  actions: {
    // Agregar un nuevo proyecto
    agregarProyecto(nombreProyecto: string) {
      const proyecto = { 
        id: Date.now().toString(), 
        nombre: nombreProyecto, 
        tareas: [], 
        progreso: 0 
      };
      this.proyectos.push(proyecto);
    },

    // Incrementar el número de tareas agregando una nueva tarea 
    incrementarTareas(idProyecto: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        const nuevaTarea = {
          id: Date.now().toString(),
          nombre: `Tarea ${proyecto.tareas.length + 1}`,
          completada: false,
          fechaHoraRegistro: new Date(), // Registrar la fecha y hora
        };
        proyecto.tareas.push(nuevaTarea);
      }
    },

    // Calcular y actualizar el progreso del proyecto
    actualizarProgreso(idProyecto: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        const tareasCompletadas = proyecto.tareas.filter((tarea) => tarea.completada).length;
        proyecto.progreso = (tareasCompletadas / proyecto.tareas.length) * 100 || 0;
      }
    },

    // Agregar una tarea a un proyecto específico con la fecha y hora de registro
    agregarTarea(idProyecto: string, nombreTarea: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        proyecto.tareas.push({
          id: Date.now().toString(),
          nombre: nombreTarea,
          completada: false,
          fechaHoraRegistro: new Date(), // Registrar la fecha y hora al agregar la tarea
        });
        this.actualizarProgreso(idProyecto); // Actualizar el progreso después de agregar la tarea
      }
    },

    // Actualizar el estado de completado de una tarea específica y recalcular el progreso
    actualizarEstadoTarea(idProyecto: string, idTarea: string, completada: boolean) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        const tarea = proyecto.tareas.find((tarea) => tarea.id === idTarea);
        if (tarea) {
          tarea.completada = completada;
          this.actualizarProgreso(idProyecto); // Actualizar progreso cuando cambia el estado de la tarea
        }
      }
    },

    // Editar una tarea existente
    editarTarea(idProyecto: string, idTarea: string, nuevoNombre: string) {
      const proyecto = this.proyectos.find((p) => p.id === idProyecto);
      const tarea = proyecto?.tareas.find((t) => t.id === idTarea);
      if (tarea) {
        tarea.nombre = nuevoNombre;
        tarea.fechaHoraRegistro = new Date(); // Actualiza la fecha y hora al editar
      }
    },

    // Nueva función para eliminar una tarea
    eliminarTarea(idProyecto: string, idTarea: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        proyecto.tareas = proyecto.tareas.filter(tarea => tarea.id !== idTarea);
        this.actualizarProgreso(idProyecto); // Opcional: Actualizar el progreso después de eliminar la tarea
      }
    }
  }
});
