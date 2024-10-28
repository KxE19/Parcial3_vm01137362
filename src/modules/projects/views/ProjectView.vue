<template>
  <div class="p-8 overflow-x-auto w-full">
    <h2>Nombre Proyecto: {{ proyectoActual?.nombre }}</h2>

    <div class="mt-4">
      <input
        v-model="nuevaTarea"
        type="text"
        placeholder="Agregar nueva tarea"
        class="input input-bordered mr-2"
      />
      <button @click="agregarTarea" class="btn btn-primary">Agregar</button>
    </div>

    <div v-if="advertenciaVisible" class="advertencia mt-4 text-red-600">
      Se ha excedido el límite de 10 tareas. No se puede agregar más.
    </div>

    <table class="table mt-4">
      <thead>
        <tr>
          <th>#</th>
          <th>Completada</th>
          <th>Tarea</th>
          <th>Fecha y hora de Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tarea, index) in proyectoActual?.tareas" :key="tarea.id">
          <td>{{ index + 1 }}</td>
          <td>
            <input
              type="checkbox"
              v-model="tarea.completada"
              @change="toggleTareaCompletada(index)"
            />
          </td>
          <td>{{ tarea.nombre }}</td>
          <td>{{ formatFechaHora(tarea.fechaHoraRegistro) }}</td>
          <td>
            <button @click="abrirModalEdicion(index)" class="btn btn-icon">
              <EditIcon />
            </button>
            <button @click="abrirModalEliminar(tarea.id)" class="btn btn-icon">
              <DeleteIcon />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de edición usando EditTarea -->
    <EditTarea
      :open="modalEdicionVisible"
      :tareaNombre="tareaSeleccionada?.nombre || ''"
      @update="actualizarTarea"
      @close="cerrarModalEdicion"
    />

    <!-- Modal de eliminación usando DeleteTarea -->
    <DeleteTarea
      :open="modalEliminarVisible"
      :tareaNombre="tareaSeleccionada?.nombre || ''" 
      @delete="eliminarTarea"  
      @close="cerrarModalEliminar"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProyectosStore } from '../store/projects.store';
import EditTarea from '@/modules/common/components/EditTarea.vue';
import DeleteTarea from '@/modules/common/components/DeleteTarea.vue'; 
import EditIcon from '@/modules/common/icons/EditIcon.vue';
import DeleteIcon from '@/modules/common/icons/DeleteIcon.vue'; 

const proyectosStore = useProyectosStore();
const route = useRoute();
const nuevaTarea = ref('');
const advertenciaVisible = ref(false);
const maxTareas = 10;

const proyectoActual = computed(() =>
  proyectosStore.proyectos.find((proyecto) => proyecto.id === route.params.id)
);

const modalEdicionVisible = ref(false);
const tareaSeleccionada = ref<{ id: string; nombre: string } | null>(null);
const modalEliminarVisible = ref(false); 

const agregarTarea = () => {
  if (proyectoActual.value && proyectoActual.value.tareas.length >= maxTareas) {
    advertenciaVisible.value = true;
    return;
  }

  if (nuevaTarea.value.trim() !== '') {
    proyectosStore.agregarTarea(route.params.id as string, nuevaTarea.value.trim());
    nuevaTarea.value = '';
    advertenciaVisible.value = false;
  }
};

const toggleTareaCompletada = (index: number) => {
  if (proyectoActual.value) {
    const tarea = proyectoActual.value.tareas[index];
    proyectosStore.actualizarEstadoTarea(route.params.id as string, tarea.id, tarea.completada);
  }
};

const formatFechaHora = (fecha: Date) => {
  return new Date(fecha).toLocaleString();
};

const abrirModalEdicion = (index: number) => {
  tareaSeleccionada.value = proyectoActual.value?.tareas[index] || null;
  modalEdicionVisible.value = true;
};

const cerrarModalEdicion = () => {
  modalEdicionVisible.value = false;
};

const actualizarTarea = (nuevoNombre: string) => {
  if (tareaSeleccionada.value) {
    proyectosStore.editarTarea(route.params.id as string, tareaSeleccionada.value.id, nuevoNombre);
  }
  cerrarModalEdicion();
};

// Abrir modal de eliminación
const abrirModalEliminar = (idTarea: string) => {
  tareaSeleccionada.value = proyectoActual.value?.tareas.find(t => t.id === idTarea) || null;
  modalEliminarVisible.value = true;
};

// Cerrar modal de eliminación
const cerrarModalEliminar = () => {
  modalEliminarVisible.value = false;
};

// Eliminar tarea
const eliminarTarea = () => {
  if (tareaSeleccionada.value) {
    proyectosStore.eliminarTarea(route.params.id as string, tareaSeleccionada.value.id);
    cerrarModalEliminar(); // Cerrar el modal después de eliminar
  }
};
</script>

<style scoped>
.advertencia {
  padding: 10px;
  border: 1px solid red;
  border-radius: 5px;
  background-color: #f8d7da; 
}

.btn-icon {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}
</style>
