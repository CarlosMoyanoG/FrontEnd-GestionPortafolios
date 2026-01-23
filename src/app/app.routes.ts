import { Routes } from '@angular/router';
import { PaginaInicio } from './paginas/pagina-inicio/pagina-inicio';
import { AdminDashboard } from './paginas/admin-dashboard/admin-dashboard';
import { AdminProgramador } from './paginas/admin-programador/admin-programador';
import { Agendar } from './paginas/agendar/agendar';
import { Login } from './paginas/login/login';
import { Portafolio } from './paginas/portafolio/portafolio';
import { adminGuard } from './guards/admin.guard';
import { programadorGuard } from './guards/programador.guard';
import { MisAsesoriasCliente } from './paginas/mis-asesorias-cliente/mis-asesorias-cliente';
import { ReporteAsesorias } from './paginas/reporte-asesorias/reporte-asesorias';
import { ReporteProyectosUsuario } from './paginas/reporte-proyectos-usuario/reporte-proyectos-usuario';
import { ReportesDashboard } from './paginas/reportes-dashboard/reportes-dashboard';
import { TestUsuarios } from './paginas/tests/test-usuarios/test-usuarios';
import { TestProgramadores } from './paginas/tests/test-programadores/test-programadores';
import { TestProyectos } from './paginas/tests/test-proyectos/test-proyectos';
import { TestAsesorias } from './paginas/tests/test-asesorias/test-asesorias';
import { TestDisponibilidades } from './paginas/tests/test-disponibilidades/test-disponibilidades';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'inicio', component: PaginaInicio},
    {path: 'agendar', component: Agendar},
    {path: 'login', component: Login},
    {path: 'portafolios/:id', component: Portafolio},
    {path: 'mis-asesorias', component: MisAsesoriasCliente },
    {path: 'reporte-asesorias', component: ReporteAsesorias, canActivate: [adminGuard] },
    {path: 'reporte-proyectos-usuario', component: ReporteProyectosUsuario, canActivate: [adminGuard] },
    {path: 'reportes', component: ReportesDashboard, canActivate: [adminGuard] },
    {path: 'tests/usuarios', component: TestUsuarios, canActivate: [adminGuard] },
    {path: 'tests/programadores', component: TestProgramadores, canActivate: [adminGuard] },
    {path: 'tests/proyectos', component: TestProyectos, canActivate: [adminGuard] },
    {path: 'tests/asesorias', component: TestAsesorias, canActivate: [adminGuard] },
    {path: 'tests/disponibilidades', component: TestDisponibilidades, canActivate: [adminGuard] },
    
    {
        path: 'admin',
        component: AdminDashboard,
        canActivate: [adminGuard]        
    },
    {
        path: 'programador',
        component: AdminProgramador,
        canActivate: [programadorGuard]   
    },

    {path: '**' , redirectTo: 'inicio' }
];


