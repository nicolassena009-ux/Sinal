export const SceneRegistry={
 choking:()=>import('./Cafeteria').then(m=>m.Cafeteria),
 seizure:()=>import('./Classroom').then(m=>m.Classroom),
 cardiac_arrest:()=>import('./Corridor').then(m=>m.Corridor),
 burns:()=>import('./Kitchen').then(m=>m.Kitchen),
 trauma:()=>import('./Courtyard').then(m=>m.Courtyard)
};
