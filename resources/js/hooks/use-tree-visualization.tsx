import * as d3 from 'd3';
import { DecisionTreeClassifier } from 'ml-cart';
import { useEffect, useRef } from 'react';

interface TreeNode {
    name: string;
    children?: TreeNode[];
    rule?: string;
    value?: string;
    isLeaf?: boolean;
}

interface JsonModel {
    root: any;
}
export const useTreeVisualization = (treeModel: DecisionTreeClassifier | null, containerId: string) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    // Konversi model ml-cart ke format yang bisa divisualisasikan
    const convertTreeToD3Format = (model: DecisionTreeClassifier): TreeNode => {
        try {
            const jsonModel = model.toJSON() as JsonModel;
            // Pastikan model memiliki struktur yang benar
            if (!jsonModel || !jsonModel.root) {
                throw new Error('Invalid tree model structure');
            }
            return transformNode(jsonModel.root);
        } catch (error) {
            console.error('Error converting tree model:', error);
            return {
                name: 'Error loading tree',
                value: 'Could not parse tree structure',
            };
        }
    };

    const transformNode = (node: any): TreeNode => {
        // Penanganan jika node tidak terdefinisi
        if (!node) {
            return {
                name: 'Empty node',
                value: 'No data',
            };
        }

        // Cek berdasarkan properti yang ada, bukan 'type'
        if (node.left === undefined && node.right === undefined) {
            // Ini adalah leaf node
            return {
                name: `Class: ${node.label || 'unknown'}`,
                value: node.label || 'unknown',
                isLeaf: true,
            };
        }

        // Ini adalah decision node
        return {
            name: `Feature ${node.kind !== undefined ? node.kind : '?'}`,
            rule: `Threshold: ${node.gainThreshold !== undefined ? node.gainThreshold.toFixed(2) : '?'}`,
            children: [
                {
                    name: 'True',
                    ...transformNode(node.left),
                },
                {
                    name: 'False',
                    ...transformNode(node.right),
                },
            ],
        };
    };
    // Fungsi untuk membersihkan SVG sebelumnya
    const cleanupPreviousVisualization = () => {
        const container = d3.select(`#${containerId}`);
        container.selectAll('*').remove();
    };

    // Fungsi utama untuk merender visualisasi pohon
    const renderTree = (data: TreeNode) => {
        cleanupPreviousVisualization();

        const container = document.getElementById(containerId);
        if (!container) return;

        // Handle case when data is empty or error
        if (!data || data.name === 'Error loading tree') {
            container.innerHTML = `<p>${data?.value || 'No tree data available'}</p>`;
            return;
        }

        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 50, right: 90, bottom: 50, left: 90 };

        const svg = d3
            .select(`#${containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .attr('style', 'max-width: 100%; height: auto;');

        svgRef.current = svg.node();

        // Buat tooltip
        const tooltip = d3
            .select(`#${containerId}`)
            .append('div')
            .attr('class', 'tree-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'white')
            .style('border', '1px solid #ddd')
            .style('border-radius', '4px')
            .style('padding', '8px')
            .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)')
            .style('pointer-events', 'none');

        tooltipRef.current = tooltip.node();

        // Hierarchical layout
        const root = d3.hierarchy(data);
        const treeLayout = d3.tree<TreeNode>().size([width - margin.left - margin.right, height - margin.top - margin.bottom]);
        treeLayout(root);

        // Gambar link
        svg.append('g')
            .attr('fill', 'none')
            .attr('stroke', '#555')
            .attr('stroke-opacity', 0.4)
            .attr('stroke-width', 1.5)
            .selectAll('path')
            .data(root.links())
            .join('path')
            .attr(
                'd',
                d3
                    .linkVertical()
                    .x((d:any) => d.x)
                    .y((d:any) => d.y) as any,
            );

        // Buat grup node
        const node = svg
            .append('g')
            .selectAll('g')
            .data(root.descendants())
            .join('g')
            .attr('transform', (d:any) => `translate(${d.x},${d.y})`);

        // Tambahkan lingkaran untuk node
        node.append('circle')
            .attr('r', 5)
            .attr('fill', (d:any) => (d.data.isLeaf ? '#ff7f0e' : '#1f77b4'))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('r', 8);

                let tooltipContent = `<strong>${d.data.name}</strong>`;
                if (d.data.rule) tooltipContent += `<br/>${d.data.rule}`;
                if (d.data.value) tooltipContent += `<br/>Value: ${d.data.value}`;

                tooltip
                    .html(tooltipContent)
                    .style('opacity', 1)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY + 10}px`);
            })
            .on('mouseout', function () {
                d3.select(this).attr('r', 5);
                tooltip.style('opacity', 0);
            });

        // Tambahkan teks untuk node
        node.append('text')
            .attr('dy', '0.31em')
            .attr('x', (d:any) => (d.children ? -8 : 8))
            .attr('text-anchor', (d:any) => (d.children ? 'end' : 'start'))
            .text((d:any) => {
                if (d.data.isLeaf) return `Class: ${d.data.value}`;
                return d.data.name;
            })
            .style('font-size', '12px')
            .style('fill', '#333')
            .clone(true)
            .lower()
            .attr('stroke', 'white')
            .attr('stroke-width', 3);

        // Tambahkan teks untuk rule di edge
        svg.selectAll('.link-label')
            .data(root.links())
            .enter()
            .append('text')
            .attr('class', 'link-label')
            .attr('x', (d:any) => (d.source.x + d.target.x) / 2)
            .attr('y', (d:any) => (d.source.y + d.target.y) / 2)
            .attr('dy', '-0.5em')
            .attr('text-anchor', 'middle')
            .text((d:any) => {
                const target = d.target as d3.HierarchyPointNode<TreeNode>;
                return target.data.name === 'True' ? '≤' : '>';
            })
            .style('font-size', '10px')
            .style('fill', '#666');
    };

    // Effect untuk merender ulang ketika model berubah
    useEffect(() => {
        if (!treeModel) {
            // Tampilkan pesan atau visualisasi kosong jika model belum ada
            cleanupPreviousVisualization();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<p>Tree model not yet loaded</p>';
            }
            return;
        }

        try {
            const treeData = convertTreeToD3Format(treeModel);
            if (treeData) {
                renderTree(treeData);
            }
        } catch (error) {
            console.error('Error rendering tree:', error);
            cleanupPreviousVisualization();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<p>Error rendering tree: ${error instanceof Error ? error.message : String(error)}</p>`;
            }
        }

        return () => {
            cleanupPreviousVisualization();
        };
    }, [treeModel, containerId]);
};
